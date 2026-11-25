#ifndef OB64_GAME_FORMATION_PANEL_H
#define OB64_GAME_FORMATION_PANEL_H

#include "common/types.h"

typedef struct FormationState {
    u8 field_00[0x0C];
    void *squad;
    int squad_source_index;
    u8 slot_flags[15];
} FormationState;

typedef struct FormationIconPixels {
    s32 variant;
    s32 icon;
    s32 style;
    const u8 *pixels;
} FormationIconPixels;

typedef struct FormationPanelView {
    FormationState formations[2];
    FormationIconPixels icon_pixels[30];
    const u8 *icon_palettes[6];
    const u8 *grid_texture;
    const u8 *cell_texture;
    const u8 *hp_texture;
} FormationPanelView;

/* The five member-index and formation-slot bytes are parallel arrays. */
typedef struct FormationSquadView {
    u8 field_00;
    u8 style;
    u8 member_indices[5];
    u8 formation_slots[5];
} FormationSquadView;

extern FormationPanelView *D_801CFA70;

void func_00209774(s32 selector, void *state, s32 squad_source_index);

#endif
