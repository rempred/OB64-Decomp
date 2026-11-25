typedef signed char s8;
typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000c54c0(s32 k);
s32 func_000b246c(void);
typedef struct {
    s8 v[5][4];
} Moves7D;
extern Moves7D D_801EFF58;
void func_000c54c0(s32 se);
void func_000c8c60(void) {
    Moves7D t = D_801EFF58;
    s32 d = func_000b246c();
    s32 to;
    u16 cur;
    if (d >= 0) {
        cur = (*(u16 *)((u8 *)(D_80196AF8) + (0x198)));
        to = t.v[cur][d];
        if (to >= 0) {
            if (cur != to) {
                func_000c54c0(2);
            }
            (*(u16 *)((u8 *)(D_80196AF8) + (0x198))) = to;
        }
    }
}
