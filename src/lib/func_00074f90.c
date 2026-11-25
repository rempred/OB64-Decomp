typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
void *func_00001330(s32 size);
void *func_000016C4(void *ptr);
extern u8 *D_8019780C;
s32 memcmp_0002cc90(void *a, void *b, s32 n);
void func_0001aaa0(void);
void func_0001aac0(void);
void func_0001afd0(void *p, s32 k);
void func_0001b240(void *a, void *b);
typedef struct {
    s16 h[13];
} Rec712;
typedef struct {
    u8 b[26];
} Note712;
typedef struct {
    Rec712 rec;
    u8 pad1A[6];
    u16 sum0;
    u16 sum1;
} SaveHdr712;
typedef struct {
    u32 size;
    u8 pad4[0x1C];
} NoteState712;
typedef struct {
    u8 pad[0x54];
    NoteState712 st[16];
    u8 pad254[0x298 - 0x254];
    Note712 notes[16];
} PakNotes712;
void func_0001b320(void *file, void *state);
void func_0001b0a0(void *file, u8 *noteName, u8 *extName, u32 mode, s32 size);
void func_0001b290(void *file, s32 offset, s32 size, u8 *buf, u32 mode);
extern signed char D_801A1DB8[];
extern signed char D_801A1DBC[];
void func_0001a4f0(u32 addr, void *buf, u32 size, s32 write);
u16 D_80075AC4(u8 *p, u16 len);
u16 D_80075B60(u8 *p, u16 len);
extern signed char D_801A2464[];
extern inline s32 PakChanged712(void) {
    u8 states[16][0x20];
    s32 i;
    s32 v;
    s32 err = 0;
    for (i = 0; i < 16; i++) {
        (*(s32 *)((u8 *)(D_8019780C) + (0x258))) = i;
        func_0001b320(D_8019780C + 0x254, states[i]);
        if ((v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
            (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
            err = 1;
            break;
        }
    }
    if (err != 0) {
        return 1;
    }
    for (i = 0; i < 16; i++) {
        if (memcmp_0002cc90(&((PakNotes712 *)D_8019780C)->st[i], states[i], 0x20) != 0) {
            err = 1;
            break;
        }
    }
    return err != 0;
}
s32 func_00074f90(void) {
    s32 r;
    u8 *save;
    s32 i;
    s32 v;
    if ((*(s32 *)((u8 *)(D_8019780C + (*(s32 *)((u8 *)(D_8019780C) + (0x50))) * 4) + (0x450))) == -1) {
        s32 code = 0;
        s32 n = 0;
        s32 j;
        for (j = 0; j < 16; j++) {
            n += (*(u16 *)((u8 *)(D_8019780C + j * 32) + (0x5C))) != 0;
        }
        if (n == 16) {
            code = 0x76;
        }
        if (code != 0) {
            (*(s32 *)((u8 *)(D_8019780C) + (0x3C))) = code;
            return 2;
        }
    }
    save = func_00001330(0x1900);
    func_0001a4f0((*(s32 *)((u8 *)(D_8019780C) + (0x48))) * 0x1850 + 0x10, save + 0x20, 0x1850, 0);
    ((SaveHdr712 *)save)->sum0 = D_80075AC4(save + 0x2C, 0x1844);
    ((SaveHdr712 *)save)->sum1 = D_80075B60(save + 0x2C, 0x1844);
    ((SaveHdr712 *)save)->rec = *(Rec712 *)(D_8019780C + (*(s32 *)((u8 *)(D_8019780C) + (0x48))) * 26 + 0x264);
    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = 0;
    func_0001aaa0();
    func_0001afd0(D_8019780C + 0x254, 0);
    r = 0;
    if ((v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
        (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
    }
    switch ((*(u32 *)((u8 *)(D_8019780C) + (0x438)))) {
        case 2:
            if (PakChanged712()) {
                break;
            }
        case 0:
            func_0001b240(D_801A1DB8, D_801A1DBC);
            func_0001b0a0(D_8019780C + 0x254, D_8019780C + 0x43C, (u8 *)D_801A2464, 1, 0x1900);
            if ((v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
                (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
            } else {
                func_0001b290(D_8019780C + 0x254, 0, 0x1900, save, 1);
                if ((v = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
                    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = v;
                }
            }
            break;
        case 10:
            r = 1;
            break;
    }
    func_0001aac0();
    func_000016C4(save);
    return r;
}
