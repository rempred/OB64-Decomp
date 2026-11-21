#ifndef OB64_GAME_PANEL_CONSTRUCTOR_H
#define OB64_GAME_PANEL_CONSTRUCTOR_H

#include "game/cutscene_panels.h"

Panel *func_00051eb0(u16 kind, u8 flags, PanelCallback callback,
                     s16 x0, s16 y0, s16 x1, s16 y1,
                     s16 x2, s16 y2, s16 x3, s16 y3);

/* Retain the accepted relocation spellings for the same resident entry. */
Panel *D_8017BFB0(u16 kind, u8 flags, PanelCallback callback,
                   s16 x0, s16 y0, s16 x1, s16 y1,
                   s16 x2, s16 y2, s16 x3, s16 y3);
Panel *func_8017BFB0(u16 kind, u8 flags, PanelCallback callback,
                     s16 x0, s16 y0, s16 x1, s16 y1,
                     s16 x2, s16 y2, s16 x3, s16 y3);

#endif
