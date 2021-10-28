"""A Spell/Ability in the Game."""

# IMPORT STANDARD LIBRARIES
import typing

# IMPORT LOCAL LIBRARIES
from lorgs.models import base


class WowSpell(base.Model):
    """Container to define a spell."""

    # TODO: those should be constants somewhere
    TYPE_RAID = "other-raid"
    TYPE_PERSONAL = "personal"
    TYPE_EXTERNAL = "external"

    TYPE_BUFFS = "other-buffs"
    TYPE_TRINKET = "other-trinkets"
    TYPE_POTION = "other-potions"

    # tags to indicate special properties
    TAG_DYNAMIC_CD = "dynamic_cd"

    @staticmethod
    def spell_ids(spells: typing.List["WowSpell"]) -> typing.List[int]:
        """Converts a list of Spells to their spell_ids."""
        ids = [spell.spell_id for spell in spells]
        ids = sorted(list(set(ids)))
        return ids

    @classmethod
    def spell_ids_str(cls, spells: typing.List["WowSpell"]) -> str:
        """Converts a list of Spells into a string of spell ids.

        Used to construct queries

        Example:
            spell_ids_str([Spell100, Spell200, Spell300])
            >>> "100,200,300
        """
        spell_ids = cls.spell_ids(spells)
        return ",".join(str(spell_id) for spell_id in spell_ids)


    def __init__(self, spell_id: int, cooldown: int = 0, duration: int = 0, show: bool = True, **kwargs):
        self.spell_id = spell_id
        self.cooldown = cooldown
        self.duration = duration

        self.icon = kwargs.get("icon") or ""
        self.name = kwargs.get("name") or ""
        self.show = show
        self.color = kwargs.get("color") or ""

        # str: type/category of spell
        self.spell_type = kwargs.get("spell_type") or ""

        # list(str): tags to indicate special properties
        self.tags = kwargs.get("tags") or []

        """str: info used for the wowhead tooltips."""
        self.wowhead_data = kwargs.get("wowhead_data") or  f"spell={self.spell_id}"

    def __repr__(self):
        return f"<Spell({self.spell_id}, cd={self.cooldown})>"

    def is_item_spell(self):
        """bool: true if this spell from an item."""
        return self.spell_type in (self.TYPE_TRINKET, self.TYPE_POTION)

    def is_healing_cooldown(self):
        """bool: true if a spell is what we call a healer cooldown."""
        if self.is_item_spell():
            return False
        if self.spell_type in (self.TYPE_PERSONAL, ):
            return False
        return True

    ##########################
    # Methods
    #
    def as_dict(self):
        return {
            "spell_id": self.spell_id,
            "duration": self.duration,
            "cooldown": self.cooldown,
            "spell_type": self.spell_type,

            # display attributes
            "name": self.name,
            "icon": self.icon,
            "color": self.color,
            "show": self.show,
            "tooltip_info": self.wowhead_data,

            "tags": self.tags,
        }
