typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000c54c0(s32 k);
s32 func_000b246c(void);
void func_000c54c0(s32 se);
void func_000c890c(s32 l);
void func_000c8afc(u8 *o) {
    u16 old = (*(u16 *)((u8 *)(D_80196AF8) + (0x19A)));
    s32 d = func_000b246c();
    if (d >= 0) {
        switch (d) {
            case 0:
                if ((*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) >= 3) {
                    (*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) -= 3;
                }
                break;
            case 1:
                if ((*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) < 6) {
                    (*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) += 3;
                }
                break;
            case 2:
                if ((u16)((*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) % 3) != d) {
                    (*(u16 *)((u8 *)(D_80196AF8) + (0x19A)))++;
                }
                break;
            case 3:
                if ((u16)((*(u16 *)((u8 *)(D_80196AF8) + (0x19A))) % 3) != 0) {
                    (*(u16 *)((u8 *)(D_80196AF8) + (0x19A)))--;
                }
                break;
        }
        if (old != (*(u16 *)((u8 *)(D_80196AF8) + (0x19A)))) {
            func_000c54c0(2);
        }
    }
    func_000c890c(o);
}
