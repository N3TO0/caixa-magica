"""merge user migration heads

Revision ID: d1e2f3a4b5c6
Revises: 3f2e1d0c9b8a, c4d5e6f7a8b9
Create Date: 2026-07-09 00:00:02.000000

"""
from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "d1e2f3a4b5c6"
down_revision: Union[str, Sequence[str], None] = ("3f2e1d0c9b8a", "c4d5e6f7a8b9")
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
