typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
void memcpy_aligned(void *dst, void *src, s32 n);
typedef struct {
    u8 unk00[0x7E];
    u8 step;
} Seq20F;
extern Seq20F *D_801F0550;
void func_00019e10(void);
void func_00242B70(s8 mode, void *data_ptr, s16 w, s16 h);
void func_00243274(u8 last);
void func_00243458(void) {
    u8 *src;
    s32 row;
    s16 y;
    func_00019e10();
    if (((u8 *)D_801F0550)[0x7E] == 0) {
        if (((u8 *)D_801F0550)[0x80] == 0) {
            (*(u8 * *)((u8 *)(D_801F0550) + (0x70))) = (*(u8 * *)((u8 *)(D_801F0550) + (0x74))) + 8;
        } else {
            (*(u8 * *)((u8 *)(D_801F0550) + (0x70))) = (*(u8 * *)((u8 *)(D_801F0550) + (0x74)));
        }
        func_00242B70((*(s8 *)((u8 *)(D_801F0550) + (0x7D))), (*(void * *)((u8 *)(D_801F0550) + (0x68))),
                                 (*(s16 *)((u8 *)(D_801F0550) + (0x78))), (*(s16 *)((u8 *)(D_801F0550) + (0x7A))));
        while (((u8 *)D_801F0550)[0x7E] != 2) {
            func_00019e10();
        }
        func_00019e10();
        func_00243274(0);
    } else if (((u8 *)D_801F0550)[0x7E] == 3) {
        func_00243274(1);
        while (((u8 *)D_801F0550)[0x7E] != 5) {
            func_00019e10();
        }
        src = (*(u8 * *)((u8 *)(D_801F0550) + (0x64)));
        row = (*(s16 *)((u8 *)(D_801F0550) + (0x78))) * 2;
        for (y = 0; y < (*(s16 *)((u8 *)(D_801F0550) + (0x7A))); y++) {
            memcpy_aligned((*(u8 * *)((u8 *)(D_801F0550) + (0x70))), src,
                          (*(s16 *)((u8 *)(D_801F0550) + (0x78))) * 2);
            (*(u8 * *)((u8 *)(D_801F0550) + (0x70))) += row;
            src += 0x280;
        }
        if (((u8 *)D_801F0550)[0x80] == 0) {
            (*(u8 * *)((u8 *)(D_801F0550) + (0x74)))[0] = '6';
            (*(u8 * *)((u8 *)(D_801F0550) + (0x74)))[1] = '4';
            (*(u8 * *)((u8 *)(D_801F0550) + (0x74)))[2] = 0;
            (*(u8 * *)((u8 *)(D_801F0550) + (0x74)))[3] = 2;
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(D_801F0550) + (0x74)))) + (4))) = (*(s16 *)((u8 *)(D_801F0550) + (0x78)));
            (*(u16 *)((u8 *)((*(u8 * *)((u8 *)(D_801F0550) + (0x74)))) + (6))) = (*(s16 *)((u8 *)(D_801F0550) + (0x7A)));
        }
        ((u8 *)D_801F0550)[0x7E]++;
    }
}
