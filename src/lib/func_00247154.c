#include "game/combat_pose_record.h"
#include "game/combat_draw_commands.h"
typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef float f32;
void func_00246270(u8 *img, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
s32 D_801C2178(s32 handle, s32 directoryIndex, u32 selected, CombatPoseRecord *record);
void *D_801C33F8(s32 handle, CombatPoseIndexedRecord *request, u32 selected, u8 *valueOut);
u32 D_801BE9A8(s32 siz, u32 w);
void func_0024660C(u8 *img, u8 *pal, s32 a, s32 b, s32 w, s32 h, f32 x, f32 y);
void func_00247154(u8 *a, s16 ox, s16 oy) {
    s32 i = 0;
    for (;; i++) {
        CombatPoseScratch pose;
        u8 *img;
        u8 *img2;
        s32 sz;
        if ((a + i)[0x16] == 0) {
            continue;
        }
        if (!D_801C2178((*(s32 *)((u8 *)(a) + (0))), (*(s16 *)((u8 *)(a) + (0xE))), i, &pose.indexed.record)) {
            return;
        }
        img = D_801C33F8((*(s32 *)((u8 *)(a) + (0))), &pose.indexed, (*(u32 *)((u8 *)(a) + (4))), 0);
        img2 = img;
        sz = D_801BE9A8(img[3], (*(u16 *)((u8 *)(img) + (4))));
        if ((*(u16 *)((u8 *)(img) + (2))) == 2) {
            u8 *pal = img + (sz * (*(u16 *)((u8 *)(img) + (6))) + 8);
            { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC2197FF); _g->second = (0xFFFFFE38); };
            func_0024660C(img, pal, 0, 0, pose.indexed.record.field_0C, pose.indexed.record.field_10, ox + pose.indexed.record.field_04, oy + pose.indexed.record.field_08);
        } else {
            { CombatDrawCommand *_g = D_800E9BA0++; _g->first = (0xFC1197FF); _g->second = (0xFFFFFE38); };
            func_00246270(img2, 0, 0, pose.indexed.record.field_0C, pose.indexed.record.field_10, ox + pose.indexed.record.field_04, oy + pose.indexed.record.field_08);
        }
    }
}
