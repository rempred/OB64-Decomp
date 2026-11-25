typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
void *func_00001330(s32 size);
extern u8 *D_8022A970;
extern void *D_800E8210;
void func_002B5044(void *buf, s32 a, s32 b, s32 w, u16 h);
void memcpy_aligned(void *dst, void *src, s32 n);
void func_002B3D30(void) {
    u8 *b = func_00001330(0x25808);
    (*(u8 * *)((u8 *)(D_8022A970) + (0x54))) = b;
    func_002B5044((*(u8 * *)((u8 *)(D_8022A970) + (0x54))), 0, 2, 0x140, 0xF0);
    memcpy_aligned(b + 8, D_800E8210, 0x25800);
}
void func_002B5044(void *buf, s32 a, s32 b, s32 w, u16 h);
