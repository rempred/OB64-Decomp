#include "game/unit_record_lookup.h"

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
    u8 unk0;
    u8 flags;
    u8 members[5];
    u8 pos[5];
    u8 harmony;
    u8 items[10];
    u8 strategy;
    u8 legion;
} SquadRec;
typedef struct {
    Character c;
    u8 unk34[4];
} PlayerChar;
extern SquadRec g_func_001957D0_source_records[];
extern PlayerChar D_80193BC0_copy[];
extern Character D_80195560_copy[];
inline s32 func_0012DA9C(void *unit) {
    u8 sq = ((const u8 *)unit)[4];
    s32 leader = g_func_001957D0_source_records[sq].members[0];
    u8 st;
    if (leader == 0 || leader >= 100) {
        return 0;
    }
    if (sq < 30) {
        st = D_80193BC0_copy[leader].c.status & 4;
    } else {
        st = D_80195560_copy[leader].status & 4;
    }
    return st != 0;
}
