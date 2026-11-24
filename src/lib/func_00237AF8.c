typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct BattleObj {
    u8 unk00[0x18];
    s32 unk18;
    u8 unk1C[0x28];
    s32 unk44;
} BattleObj;
#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
s32 D_801C8B84(BattleUnit *u);
unsigned int D_8016DF88(int, int);
unsigned int D_8016DFDC(int, int);
unsigned int D_8016E030(int, int);
unsigned int D_8016E084(int, int);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
s32 D_801C8AEC(void);
s32 D_801C8AFC(void);
typedef struct {
    u8 cls;
    u8 to;
    u8 str;
    u8 vit;
    u8 kind;
} ClassChange22;
typedef struct {
    u16 id;
    u8 equipped;
    u8 count;
} Stock22;
extern ClassChange22 D_801F6A78[5];
extern Stock22 D_80196B00[];
extern u8 D_801936E0;
unsigned int D_8016DFDC(int, int);
unsigned int D_8016E030(int, int);
unsigned int D_8016E084(int, int);
int D_8016B6FC(int);
s32 func_00237AF8(BattleUnit *u, s32 k) {
    u32 j;
    u16 eq[4];
    u16 i;
    u16 s;
    if (D_801C8AEC() != 0) {
        return 0;
    }
    if (D_801C8AFC() != 0) {
        return 0;
    }
    if (D_801936E0 != 0) {
        return 0;
    }
    for (j = 0; j < 5; j++) {
        if (D_801F6A78[j].cls != u->secondary_class_id.word) {
            continue;
        }
        if (D_801F6A78[j].kind != k) {
            continue;
        }
        if (D_801F6A78[j].str > u->strength) {
            continue;
        }
        if (D_801F6A78[j].vit > u->vitality) {
            continue;
        }
        if (D_801C8B84(u)) {
            eq[0] = (unsigned short)D_8016DF88((unsigned char)(D_801F6A78[j].to),(unsigned char)(D_801F6A78[j].to));
            eq[1] = (unsigned short)D_8016DFDC((unsigned char)(D_801F6A78[j].to),(unsigned char)(D_801F6A78[j].to));
            eq[2] = (unsigned short)D_8016E030((unsigned char)(D_801F6A78[j].to),(unsigned char)(D_801F6A78[j].to));
            eq[3] = (unsigned short)D_8016E084((unsigned char)(D_801F6A78[j].to),(unsigned char)(D_801F6A78[j].to));
            for (i = 0; i < 4; i++) {
                if (eq[i] == 0) {
                    continue;
                }
                s = (unsigned short)D_8016B6FC((unsigned short)(eq[i]));
                if (s >= 0x117) {
                    return 0;
                }
                if (eq[i] == (unsigned short)D_8016DF88((unsigned char)(u->secondary_class_id.word),(unsigned char)(u->secondary_class_id.word))) {
                    continue;
                }
                if (eq[i] == (unsigned short)D_8016DFDC((unsigned char)(u->secondary_class_id.word),(unsigned char)(u->secondary_class_id.word))) {
                    continue;
                }
                if (eq[i] == (unsigned short)D_8016E030((unsigned char)(u->secondary_class_id.word),(unsigned char)(u->secondary_class_id.word))) {
                    continue;
                }
                if (eq[i] == (unsigned short)D_8016E084((unsigned char)(u->secondary_class_id.word),(unsigned char)(u->secondary_class_id.word))) {
                    continue;
                }
                if (eq[i] == u->equipment_slot_0 || eq[i] == u->equipment_slot_1 || eq[i] == u->equipment_slot_2 ||
                    eq[i] == u->equipment_slot_3) {
                    continue;
                }
                if (D_80196B00[s].count <= D_80196B00[s].equipped) {
                    return 0;
                }
            }
        }
        return D_801F6A78[j].to;
    }
    return 0;
}
