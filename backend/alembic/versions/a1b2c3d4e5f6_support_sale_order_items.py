"""support sale order items

Revision ID: a1b2c3d4e5f6
Revises: f1a2b3c4d5e6
Create Date: 2026-07-13 18:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "f1a2b3c4d5e6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint("ck_order_items_dates", "order_items", type_="check")
    op.add_column("order_items", sa.Column("item_type", sa.String(length=20), nullable=False, server_default="rental"))
    op.add_column("order_items", sa.Column("quantity", sa.Integer(), nullable=False, server_default="1"))
    op.alter_column("order_items", "days", existing_type=sa.Integer(), nullable=True)
    op.alter_column("order_items", "start_date", existing_type=sa.Date(), nullable=True)
    op.alter_column("order_items", "end_date", existing_type=sa.Date(), nullable=True)
    op.alter_column("order_items", "item_type", server_default=None)
    op.alter_column("order_items", "quantity", server_default=None)


def downgrade() -> None:
    op.alter_column("order_items", "end_date", existing_type=sa.Date(), nullable=False)
    op.alter_column("order_items", "start_date", existing_type=sa.Date(), nullable=False)
    op.alter_column("order_items", "days", existing_type=sa.Integer(), nullable=False)
    op.drop_column("order_items", "quantity")
    op.drop_column("order_items", "item_type")
    op.create_check_constraint("ck_order_items_dates", "order_items", "end_date > start_date")
