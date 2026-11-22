#include "game/battle_panel_record.h"

void *func_0002CD70(void *destination, int value, unsigned int count);
void bzero(void *p, s32 n);
void func_001F0E04(Panel1F *p, s32 a) {
    p->h4 = a;
    p->h6 = -1;
    p->h8 = 0;
    p->h10 = 0;
    p->hE = 0;
    p->hC = 0;
    p->b46 = 0;
    p->b47 = 0;
    func_0002CD70(p->marks, 0xFF, 0x10);
    bzero(p->zero, 0x10);
}
