typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_000016C4(void *ptr);
extern u16 D_8019C91A;
extern u8 D_8019C8E8;
extern u8 D_800EB0B0[];
extern u8 D_80196AEC;
void func_00003564(s32 a, s32 b, s32 c, s32 d, s32 e, s32 f, s32 g);
void D_800EA6C8(void *p);
void D_8016C9FC(void);
typedef struct {
    u8 b[0x10];
    s16 h;
} Cfg699;
extern Cfg699 D_800E9C08;
extern Cfg699 D_801976F8;
extern Cfg699 D_800ABD80;
extern u8 D_80196AE9;
extern s16 D_8019C918;
extern s32 D_8019C8E4;
extern void *D_8019C8E0;
extern s32 D_8019C500[];
extern u8 D_8022A820;
extern u8 D_8022A824;
extern u8 D_8022A834;
extern s16 D_8022A832;
void D_80220F40(void);
void D_80224D60(void);
void D_8022845C(void);
void D_8022995C(void);
void D_80229B44(void);
void D_80220F64(u16 id, u8 v);
void *D_80074AD4(s32 a);
void D_800749C0(s32 a);
void *func_0000978C(u32 handle, ...);
void func_0006d030(void) {
    u32 i;
    if ((D_80196AEC & 0x11) != 1) {
        D_801976F8 = D_800E9C08;
        D_80196AEC &= 0xEF;
    }
    func_00003564(0, 1, 1, 0x100, 1, 0x100, 0x1400);
    D_80196AEC &= 0xF9;
    D_800EA6C8(D_800EB0B0);
    D_8019C8E8 = 0;
    D_8019C91A = 0;
    D_8019C918 = (D_80196AEC & 1) ? 6 : 0;
    func_0006ce7c();
    D_80220F40();
    D_80224D60();
    D_8022845C();
    D_8022995C();
    D_8022A824 = 8;
    D_80220F64(0x5500, 0);
    D_80229B44();
    D_8022A820 = 3;
    D_8022A834 = 8;
    D_8022A832 = 0xFF;
    D_80220F64(0x5501, 0x80);
    D_8019C8E4 = 0;
    for (i = 0; i < 3; i++) {
        void *p = D_80074AD4(D_8019C500[i]);
        if (p != ((void *)0)) {
            func_000016C4(p);
            D_800749C0(D_8019C500[i]);
            if (D_80196AE9 != 0) {
                D_8019C8E4 = 1;
            }
        }
    }
    D_800E9C08 = D_800ABD80;
    D_800E9C08.b[9] = D_801976F8.b[9];
    D_8016C9FC();
    D_8019C8E0 = func_0000978C(0x21C3C38, 0, -4, 0);
}
