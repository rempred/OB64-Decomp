




#include "game/battle_roster_types.h"
typedef BattleRosterRecord BattleUnit;
#include "game/battle_callbacks.h"
extern BattleCallbacks *D_801D0810;
u8 func_0020D434(s32 idx);
int D_8016E230(int,int,int);
int D_8016E458(int);
unsigned char D_8016E470(int,int,int,int,unsigned short);
unsigned char D_8016E50C(unsigned char *,int,int,int,unsigned char,unsigned short,unsigned short,unsigned short,unsigned short);
int D_8016F5E0(int);
u16 func_0020C448(void *u);
u8 func_0020D434(s32 idx);
s32 func_0020BDFC(BattleUnit *u) {
    u8 a;
    u8 k;
    u8 t;
    if (D_801D0810->f5 != ((void *)0)) {
        return D_801D0810->f5(u);
    }
    if (u->primary_class_id.word == 0x101) {
        return u->element;
    }
    a = (unsigned char)D_8016E230((unsigned char)(u->primary_class_id.word),(unsigned char)(u->secondary_class_id.word),(unsigned char)(func_0020D434(u->formation_row)));
    k = (unsigned char)D_8016E458((unsigned char)(a));
    if ((u8)(k - 3) < 2 || k == 5) {
        if ((u8)(a - 0x31) < 2) {
            return u->element;
        }
        if (a == 0x91) {
            t = (unsigned char)D_8016F5E0((unsigned short)(func_0020C448(u)));
            if (t >= 15) {
                return u->element;
            }
            return t;
        }
        D_8016E50C(&a,(unsigned char)(u->primary_class_id.word),(unsigned char)(u->secondary_class_id.word),(unsigned char)(a),(unsigned char)(u->element),(unsigned short)(u->equipment_slot_0),(unsigned short)(u->equipment_slot_1),(unsigned short)(u->equipment_slot_2),(unsigned short)(u->equipment_slot_3));
    }
    return D_8016E470(a, u->equipment_slot_0, u->equipment_slot_1, u->equipment_slot_2, u->equipment_slot_3);
}
