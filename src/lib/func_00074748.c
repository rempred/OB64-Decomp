typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;
extern u8 *D_8019780C;
s32 memcmp_0002cc90(void *a, void *b, s32 n);
void func_0001b240(u8 *, u8 *);
void func_00074748(void);
typedef struct {
    s16 h[13];
} Rec712;
typedef struct {
    u8 b[26];
} Note712;
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
extern inline s32 IsGameNote712(s32 i, void *a, void *b) {
    s32 o = i * 32 + 0x54;
    s32 r;
    if (memcmp_0002cc90(a, D_8019780C + o + 8, 2) != 0) {
        r = 0;
    } else {
        r = memcmp_0002cc90(b, D_8019780C + o + 4, 4) == 0;
    }
    return r;
}
void func_00074748(void) {
    s32 i;
    Rec712 rec;
    {
        u8 *b = D_8019780C;
        for (i = 0; i < 4; i++) {
            (*(s32 *)((u8 *)(b) + (i * 4 + 0x450))) = -1;
        }
    }
    for (i = 0; i < 16; i++) {
        (*(s32 *)((u8 *)(D_8019780C) + (0x258))) = i;
        func_0001b320(D_8019780C + 0x254, &((PakNotes712 *)D_8019780C)->st[i]);
        if ((*(s32 *)((u8 *)(D_8019780C) + (0x25C))) != 0) {
            bzero(&((PakNotes712 *)D_8019780C)->st[i], 0x20);
            ((PakNotes712 *)D_8019780C)->notes[i].b[0] = 0xFF;
        } else if (IsGameNote712(i, D_801A1DB8, D_801A1DBC)) {
            s32 e;
            *(s32 *)((((PakNotes712 *)D_8019780C)->st[i].pad4[0x17] << 2) + D_8019780C + 0x40C) = i;
            func_0001b240(D_801A1DB8, D_801A1DBC);
            func_0001b0a0(D_8019780C + 0x254, (u8 *)&((PakNotes712 *)D_8019780C)->st[i] + 0xE, (u8 *)&((PakNotes712 *)D_8019780C)->st[i] + 0xA, 0,
                          ((PakNotes712 *)D_8019780C)->st[i].size);
            if ((e = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
                (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = e;
            } else {
                func_0001b290(D_8019780C + 0x254, 0, 0x20, (u8 *)&rec, 0);
                *(Rec712 *)&((PakNotes712 *)D_8019780C)->notes[i] = rec;
                if ((e = (*(s32 *)((u8 *)(D_8019780C) + (0x25C)))) != 0) {
                    (*(s32 *)((u8 *)(D_8019780C) + (0x438))) = e;
                }
            }
        }
    }
}
