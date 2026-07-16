"""make profile address fields nullable

Revision ID: b7c8d9e0f1a2
Revises: d1e2f3a4b5c6
Create Date: 2026-07-10 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b7c8d9e0f1a2"
down_revision: Union[str, None] = "d1e2f3a4b5c6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("addresses", "zip_code", existing_type=sa.String(length=10), nullable=True)
    op.alter_column("addresses", "street", existing_type=sa.String(length=255), nullable=True)
    op.alter_column("addresses", "number", existing_type=sa.String(length=20), nullable=True)
    op.alter_column("addresses", "neighborhood", existing_type=sa.String(length=100), nullable=True)
    op.alter_column("addresses", "city", existing_type=sa.String(length=100), nullable=True)
    op.alter_column("addresses", "state", existing_type=sa.CHAR(length=2), nullable=True)


def downgrade() -> None:
    op.alter_column("addresses", "state", existing_type=sa.CHAR(length=2), nullable=False)
    op.alter_column("addresses", "city", existing_type=sa.String(length=100), nullable=False)
    op.alter_column("addresses", "neighborhood", existing_type=sa.String(length=100), nullable=False)
    op.alter_column("addresses", "number", existing_type=sa.String(length=20), nullable=False)
    op.alter_column("addresses", "street", existing_type=sa.String(length=255), nullable=False)
    op.alter_column("addresses", "zip_code", existing_type=sa.String(length=10), nullable=False)
