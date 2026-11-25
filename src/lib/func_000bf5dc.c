typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_80196AF8;
extern s32 D_80196A6C;
extern u8 D_801EF2CC[];
extern u8 D_80196A76[];
extern u8 D_801EF370[];
void func_000bf458(void);
s32 func_000bf88c(u8 x);
s32 func_000bf940(u8 x);
typedef struct {
    u8 pad[0x1BEE];
    u16 list[1];
} Shop87;
void func_000bf5dc(void) {
    s32 i;
    u16 *p;
    s32 n;
    u16 e;
    func_000bf458();
    i = 0;
    p = (u16 *)D_801EF2CC;
    n = 0x10;
    while ((e = *p++) != 0xFFFF) {
        if ((e & 0x8000) && (D_80196A76[i / 8] & D_801EF370[i % 8])) {
            u8 id = i;
            ((Shop87 *)D_80196AF8)->list[n] = id;
            if ((u32)D_80196A6C < (u32)func_000bf940(id) || (u8)func_000bf88c(id) != 0) {
                ((Shop87 *)D_80196AF8)->list[n] |= 0x80;
            }
            n++;
        }
        i++;
    }
    ((Shop87 *)D_80196AF8)->list[n] = 0;
    (*(u16 *)((u8 *)(D_80196AF8) + (0x1BFC))) = n - 0x10;
}
s32 func_000bf88c(u8 x);
s32 func_000bf940(u8 x);
