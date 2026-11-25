typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_8022A974;
extern u8 *D_8022A970;
typedef struct {
    s16 v[5];
} Step2B5;
extern Step2B5 D_80243D00;
void func_002B7D28(u8 *o);
void func_002B56A8(s32 k, s32 keep);
extern u16 D_800E8100;
void func_002B529C(void) {
    Step2B5 t = D_80243D00;
    s32 i;
    if (D_8022A970 == ((void *)0)) {
        return;
    }
    if ((*(s32 *)((u8 *)(D_8022A970) + (0x824))) > 0) {
        if (D_8022A970[0x83B] == 0) {
            for (i = 0; i < (*(s32 *)((u8 *)(D_8022A970) + (0x824))); i++) {
                if (i >= (*(s32 *)((u8 *)(D_8022A970) + (0x824))) - 3) {
                    s32 k = i - i / 3 * 3;
                    if ((*(s32 *)((u8 *)(D_8022A970 + k * 4) + (0x40))) != 0 && (D_8022A970 + k)[0x820] > 20) {
                        (D_8022A970 + k)[0x820] -= 20;
                    }
                }
            }
        }
        if ((*(s32 *)((u8 *)(D_8022A970) + (0x824))) > 0 && D_8022A970[0x83B] != 0) {
            for (i = (*(s32 *)((u8 *)(D_8022A970) + (0x824))); i >= 0; i--) {
                s32 k;
                if (i == (*(s32 *)((u8 *)(D_8022A970) + (0x824))) - 4) {
                    break;
                }
                k = i - i / 3 * 3;
                if ((*(s32 *)((u8 *)(D_8022A970 + k * 4) + (0x40))) != 0 && (D_8022A970 + k)[0x820] > 20) {
                    (D_8022A970 + k)[0x820] -= 20;
                }
            }
        }
    }
    for (i = 0; i < 20; i++) {
        u8 *o = ((u8 **)(D_8022A974 + 0x19F4))[i];
        s32 lim;
        s32 cur;
        u8 e;
        if (o == ((void *)0)) {
            continue;
        }
        func_002B7D28(o);
        lim = (*(s32 *)((u8 *)(o) + (0x58))) * 2 - 2;
        e = o[0x82] - 1;
        cur = (*(s32 *)((u8 *)(o) + (0x68))) * 2;
        if ((*(s32 *)((u8 *)(o) + (0x54))) != -1) {
            lim = (*(s32 *)((u8 *)(o + (*(s32 *)((u8 *)(o) + (0x54))) * 4) + (0x10))) * 2 - 2;
        } else if ((*(s32 *)((u8 *)(o) + (0x50))) != -1) {
            lim = lim * (*(s32 *)((u8 *)(o) + (0x50))) / 100;
        }
        if (cur + t.v[e] * 2 < lim) {
            (*(s32 *)((u8 *)(o) + (0x68))) += 2;
        } else {
            o[0x85] = 0;
        }
        if (o[0x86] != 0) {
            if (++o[0x86] == 30) {
                func_002B56A8(i, 0);
            }
        }
    }
    if (D_8022A970[0x840] == 1 && (D_800E8100 & 0x1000)) {
        D_8022A970[0x840] = 2;
    }
}
void func_002B56A8(s32 k, s32 keep);
