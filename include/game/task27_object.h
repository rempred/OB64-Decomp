#ifndef OB64_TASK27_OBJECT_H
#define OB64_TASK27_OBJECT_H
#include "game/panel_constructor.h"
typedef struct Obj27 {
    Panel *win;
    PanelCallback fn;
    s16 x, y, h, w;
    u8 unk10[4];
    s32 w14;
    s32 *w18;
    s16 h1C, h1E;
    Panel *w20;
    Panel *w24;
    s16 h28;
} Obj27;
extern Obj27 *D_8022CB20;
#endif
