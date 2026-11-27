typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
extern u16 D_80190EBC[];
extern u8 D_80191010[];
extern u8 D_80190F81;
u16 func_000b86f8(u8 i);
u16 func_000baad4(void);
void func_000b77f0(u16 id);
void func_000b77f0(u16 id) {
    if (id != 0xFF) {
        if (id >= 100) {
            u16 r = func_000b86f8(id);
            s32 o = id * 2;
            *(u16 *)((u8 *)D_80190EBC + o) = 0;
            D_80191010[id] = 0;
            D_80190F81 += r;
            (D_80196AF8 + o)[0x1872] = 0;
        }
        {
            s32 o = id * 2;
            if ((D_80196AF8 + o)[0x1872] & 8) {
                (*(s32 *)((u8 *)(D_80196AF8) + (0x5D4)))++;
            }
            (D_80196AF8 + o)[0x1872] = 0;
        }
        func_000baad4();
    }
}
