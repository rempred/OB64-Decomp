#include "game/battle_roster_types.h"

#include "game/battle_record_flag.h"

typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
extern struct { u8 b[12]; } D_801976DC[];
extern u8 *D_801CE8BC;
typedef struct {
    u8 unk0[0xD];
    u8 items[10];
    u8 unk17[2];
} SquadRec;
extern SquadRec g_func_001957D0_source_records[];
extern inline int func_0020C014(void *record) {
    if (record == ((void *)0)) {
        return 0;
    }

    return ((((const BattleRosterRecord *)record)->battle_flags >> 8) ^ 1) & 1;
}
s32 func_0020D814(void *record) {
    if (func_0020C014(record)) {
        return *(s32 *)(D_801CE8BC + 0x1C0);
    }
    return g_func_001957D0_source_records[D_801976DC[1].b[0]].unk17[0];
}
