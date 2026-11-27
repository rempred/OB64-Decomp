typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    s32 cur;
    s32 end;
    u16 x8;
    u16 xA;
    u16 xC;
    u16 xE;
    u16 x10;
    u16 x12;
    u8 dir;
} Ctr248;
void func_00248754(Ctr248 *c) {
    if (c != ((void *)0)) {
        if (c->dir == 0) {
            if (!(c->cur > c->end)) {
                c->cur++;
            }
        } else if (c->cur != 0) {
            c->cur--;
        }
    }
}
