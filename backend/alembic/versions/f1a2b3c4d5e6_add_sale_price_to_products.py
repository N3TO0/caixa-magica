"""add sale price to products

Revision ID: f1a2b3c4d5e6
Revises: b7c8d9e0f1a2
Create Date: 2026-07-13 16:40:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f1a2b3c4d5e6"
down_revision: Union[str, None] = "b7c8d9e0f1a2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("products", sa.Column("sale_price", sa.Numeric(10, 2), nullable=True))


def downgrade() -> None:
    op.drop_column("products", "sale_price")
