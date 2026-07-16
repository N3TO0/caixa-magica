"""add user profile fields

Revision ID: 9b1a2c3d4e5f
Revises: af6f412e7d89
Create Date: 2026-07-08 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9b1a2c3d4e5f"
down_revision: Union[str, None] = "af6f412e7d89"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("birthdate", sa.Date(), nullable=True))
    op.add_column("users", sa.Column("profile_photo", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("users", "profile_photo")
    op.drop_column("users", "birthdate")
