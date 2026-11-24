#include "game/cutscene_panels.h"
void *func_00001330(unsigned int size);
void bzero(void *p, s32 n);
typedef Panel Win28;
void bzero(void *p, s32 n);
void bzero(void *p, s32 n);
PanelContent *func_00296C50(Win28 *w, s32 a, u8 b) {
    PanelContent *t;
    w->content = t = func_00001330(0x604);
    bzero(t, 0x604);
    t = w->content;
    t->key = a;
    t->field5F3 = 0x3F;
    t->field5F6 = 0xF;
    t->field5F0 = 0;
    t->field5FE = 2;
    bzero(t, 0x500);
    t->field5F4 = b;
    t->field5F5 = b;
    return t;
}
