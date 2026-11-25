typedef unsigned char u8;
typedef signed int s32;
typedef float f32;
extern u8 *D_8022A970;
extern u8 *D_8022A974;
void memcpy_aligned(void *dst, void *src, s32 n);
void D_8022B414(s32 i);
typedef struct {
    u8 pad[0x40];
    s32 x40;
    s32 x44;
    s32 x48;
    s32 x4C;
    s32 x50;
    f32 scale;
} Obj2AE;
void D_80230DBC(s32 k);
void D_8022B414(s32 k);
void func_002B3D9C(void) {
    u8 i;
    Obj2AE *o = (*(Obj2AE * *)((u8 *)(D_8022A974) + (0x1C54)));
    for (i = 0; i < 20; i++) {
        u8 *rec = D_8022A970;
        u8 *sc = D_8022A974;
        (*(s32 *)((u8 *)(rec + i * 4) + (0x58))) = (*(s32 *)((u8 *)(sc + i * 4) + (0x1C04)));
        memcpy_aligned(rec + (i * 88 + 0xB8), (*(void * *)((u8 *)(sc + i * 4) + (0x1C54))), 0x58);
    }
    (*(s32 *)((u8 *)(D_8022A974) + (0x1C04))) = (*(s32 *)((u8 *)(D_8022A970) + (0x54)));
    o->x40 = 0;
    o->x44 = 0;
    o->x48 = 0;
    o->x4C = 0;
    o->x50 = 0;
    o->scale = 1.0f;
    (*(s32 *)((u8 *)(D_8022A974) + (0x1C08))) = (*(s32 *)((u8 *)(D_8022A974 + D_8022A970[0x838] * 4) + (0x1C04)));
    memcpy_aligned((*(void * *)((u8 *)(D_8022A974) + (0x1C58))), (*(void * *)((u8 *)(D_8022A974 + D_8022A970[0x838] * 4) + (0x1C54))), 0x58);
    {
        u8 *sc = D_8022A974;
        for (i = 2; i < 20; i++) {
            o = (*(Obj2AE * *)((u8 *)(sc + i * 4) + (0x1C54)));
            (*(s32 *)((u8 *)(sc + i * 4) + (0x1C04))) = 0;
            o->x40 = 0;
            o->x44 = 0;
            o->x48 = 0;
            o->x4C = 0;
            o->x50 = 0;
            o->scale = 1.0f;
        }
    }
    (*(u8 *)((u8 *)((*(u8 * *)((u8 *)(D_8022A974) + (0x1A44)))) + (0x15))) = 0;
    D_80230DBC(-1);
    D_8022B414(-1);
}
