#ifndef OB64_GAME_DISPLAY_LIST_CURSOR_H
#define OB64_GAME_DISPLAY_LIST_CURSOR_H

#include "game/combat_draw_commands.h"

/* The volatile pointer publishes ordered updates to the same cursor as D_800E9BA0. */
extern CombatDrawCommand *volatile gTitleCardDisplayListCursor;

#endif
