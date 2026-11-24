#ifndef GAME_DIALOG134_H
#define GAME_DIALOG134_H
#include "game/panel_constructor.h"
typedef struct {
    s32 id;
    s32 unk04;
    s32 lines;
    s32 x2;
    s32 y2;
    s32 w2;
    s32 h2;
    s32 x;
    s32 y;
    s32 w;
    s32 h;
    Panel *win;
    Panel *win2;
    u8 *text;
    void *a;
    void *b;
    void *c;
    signed char *opt0;
    signed char *opt1;
    s32 lenA;
    s32 lenB;
    s32 lenC;
    s32 len0;
    s32 len1;
    u8 sel;
    u8 d;
} Dialog134;
extern Dialog134 D_801ED540;
void func_0013511C(Dialog134 *dialog);
void func_00134CD4(Panel *panel, s32 index);
void func_00134FA8(Panel *panel, s32 index);
int func_00134830(int id, void *a, void *b, void *c, int d, int x2);
int func_001349BC(int id, void *a, void *b, void *c, int sel, int d, int x2);
#endif
