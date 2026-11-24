#include "game/battle_callbacks.h"

int func_00213B24(BattleRosterRecord *p) {
    if (p->primary_class_id.word == 0x101) {
        return p->element;
    }
    return ((unsigned char *)p)[0xA4];
}
