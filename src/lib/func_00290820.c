#include "game/class_comparison.h"

typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
typedef struct {
    Character c;
    u8 unk34[4];
} PlayerChar;
extern PlayerChar D_80193BC0_copy[];
/* Check HP and status bit 2 for the first matching class. */
s32 func_00290820(u8 class_id) {
    u8 character_index;
    for (character_index = 0; character_index < 100; character_index++) {
        if (D_8016FF5C(D_80193BC0_copy[character_index].c.cls, class_id)) {
            if (D_80193BC0_copy[character_index].c.status & 4) {
                return 1;
            }
            return D_80193BC0_copy[character_index].c.hp == 0;
        }
    }
    return 0;
}
