#ifndef OB64_GAME_CHARACTER_DISPLAY_MEMBERS_H
#define OB64_GAME_CHARACTER_DISPLAY_MEMBERS_H

#include "game/cutscene_panels.h"

typedef struct {
    Panel *panels[5];
    u8 member_indices[5];
    u8 field19[3];
    u8 fallback_class_label_start;
    u8 field1D[7];
    u8 fallback_label_start;
} CharacterDisplayMembers;

extern CharacterDisplayMembers D_8021B470;
extern void *D_8021B528[5];
extern u16 *D_8021B558[5];

void func_00189778(Panel *panel, s32 slot);

#endif
