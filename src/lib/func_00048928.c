#include "game/class_comparison.h"

typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void func_0004196c(u8 a, u8 b);
extern struct { u8 primary_class_id; u8 pad[55]; } D_80193BD1[];
extern u8 D_8018F320;
extern u8 D_8018F321;
extern s16 D_8018F322;
void func_00048510(u8 character_index);
void func_00048928(s32 mode, s32 kind, s32 val, u8 extra) {
    u8 *state_mode = &D_8018F320;
    u16 character_index;
    *state_mode = 0;
    if (mode == 1) {
        for (character_index = 0; character_index < 100; character_index++) {
            if (func_00045e5c(D_80193BD1[character_index].primary_class_id, val) == 1) {
                func_00048510(character_index);
                func_0004196c(0, character_index);
            }
        }
    } else {
        if (kind == 0) {
            *state_mode = 1;
        } else if (kind == 2) {
            *state_mode = 4;
        } else {
            *state_mode = 3;
        }
        D_8018F322 = val;
        D_8018F321 = extra;
    }
}
