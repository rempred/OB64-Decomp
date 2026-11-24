typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u16 flags;
    u8 flags2;
    u8 flags3;
    u8 unk04[2];
    s16 x;
    s16 y;
    s16 x2;
    s16 y2;
    u16 unk0E;
    void *owner;
    void (*update)(s32 slot);
    void (*draw)(s32 slot);
    void (*exit)(s32 slot);
    u16 size;
    u8 unk22[2];
    u8 *data;
    s16 unk28;
    s16 unk2A;
    u16 unk2C;
    u16 unk2E;
    u8 unk30[8];
    void *slotsA[10];
    void *slotsB[10];
    u8 unk88;
    u8 unk89;
    u8 unk8A;
    u8 unk8B;
    u8 unk8C;
    u8 unk8D;
    u8 unk8E;
    u8 unk8F;
    u8 unk90[4];
    u8 unk94;
    u8 unk95;
    u8 unk96;
    u8 unk97;
    void *unk98;
    u8 unk9C[4];
    u8 unkA0;
    u8 unkA1;
    s16 parent;
    u8 unkA4[4];
} Scene;
extern Scene g_state_slot_records[];
extern u16 g_boot_state_slot_queue_service_gate;
typedef struct {
    u8 unk00[0x26];
    u16 flags;
    u8 unk28[4];
    s32 x;
    s32 y;
    s32 x2;
    s32 y2;
} SceneWin;
typedef struct {
    void *unk00;
    SceneWin *win;
} SceneWinList;
typedef struct {
    u32 unk_hi : 3;
    u32 f1000 : 1;
    u32 f0800 : 1;
    u32 unk_lo : 27;
} SceneBits;
extern SceneWinList *D_800AF0B0;
extern u8 D_800C4C10[];
void func_0000859C(void);
void *D_80173B60(void *p);
void bcopy(const void *src, void *dst, s32 n);
extern s32 D_800C4C20;
void func_00008388(s32 i);
extern Scene D_800E7A30;
extern u8 D_800E91D0[];
void boot_state_slot_payload_alloc_copy(u8 kind, void *src, u16 n, u8 **out);
void func_00008564(u8 *p, const void *dst);
void func_00007688(void);
void func_00007894(s32 id);
s32 func_0002CBCC(void);
void D_80173D14(void *list);
void D_80173D4C(void *list);
u8 *D_8017C29C(u8 *p, s16 x, s16 y, s16 z, s16 w);
void boot_state_slot_callback_dispatch(void) {
    s32 i;
    s32 last;
    last = 0;
    i = 0;
    do {
        D_800C4C20 = i;
        if (!(g_state_slot_records[i].flags & 0x2000) && (g_state_slot_records[i].flags & 0x8000) && g_state_slot_records[i].owner != ((void *)0)) {
            bcopy(&g_state_slot_records[i], &D_800E7A30, 0xA8);
            if (i == ((u16 *)D_800C4C10)[0]) {
                D_800E7A30.flags2 |= 4;
            }
            D_800E7A30.unk04[0] = 6;
            D_800E7A30.unk98 = D_800AF0B0;
            ((void (*)(s32))D_800E7A30.owner)(i);
            if (((SceneWinList *)D_800E7A30.unk98)->win != ((void *)0)) {
                D_800E7A30.unk98 = D_80173B60(D_800E7A30.unk98);
                ((SceneWinList *)D_800E7A30.unk98)->win = D_800AF0B0->win;
                D_800AF0B0->win = ((void *)0);
                D_800E7A30.flags3 |= 2;
            } else {
                D_800E7A30.unk98 = ((void *)0);
            }
            D_800E7A30.flags |= 0x2000;
            if (i == ((u16 *)D_800C4C10)[0]) {
                D_800E7A30.flags2 &= ~4;
            }
            boot_state_slot_payload_alloc_copy(D_800E7A30.flags, D_800E91D0, D_800E7A30.size, &D_800E7A30.data);
            bcopy(&D_800E7A30, &g_state_slot_records[i], 0xA8);
            if (g_state_slot_records[i].flags2 & 2) {
                func_00008388(i);
            }
            last = i;
        }
        i++;
        i %= 6;
    } while (i != last);
    func_0000859C();
    for (i = 0; i < 6; i++) {
        D_800C4C20 = i;
        if (!(g_state_slot_records[i].flags & 0x2000) || !(g_state_slot_records[i].flags & 0x8000) || g_state_slot_records[i].update == ((void *)0)) {
            continue;
        }
        bcopy(&g_state_slot_records[i], &D_800E7A30, 0xA8);
        if (i == ((u16 *)D_800C4C10)[0]) {
            D_800E7A30.flags2 |= 4;
        }
        func_00008564(D_800E7A30.data, D_800E91D0);
        func_00007894(i);
        D_800E7A30.update(i);
        if (D_800E7A30.flags3 & 2) {
            if (!((SceneBits *)&D_800E7A30)->f1000 && !((SceneBits *)&D_800E7A30)->f0800) {
                D_8017C29C((u8 *)((SceneWinList *)D_800E7A30.unk98)->win, D_800E7A30.x - 6, D_800E7A30.y - 6,
                              D_800E7A30.x2 + 6, D_800E7A30.y2 + 6);
            }
            D_80173D14(D_800E7A30.unk98);
            D_80173D4C(D_800E7A30.unk98);
            if (((SceneWinList *)D_800E7A30.unk98)->win == ((void *)0)) {
                D_800E7A30.flags2 |= 2;
            } else if (((SceneWinList *)D_800E7A30.unk98)->win->flags == 0) {
                if (D_800E7A30.flags & 0x800) {
                    D_800E7A30.flags &= ~0x800;
                }
            } else {
                D_800E7A30.x = ((SceneWinList *)D_800E7A30.unk98)->win->x + 6;
                D_800E7A30.x2 = ((SceneWinList *)D_800E7A30.unk98)->win->x2 - 6;
                if (D_800E7A30.x2 < D_800E7A30.x) {
                    D_800E7A30.x = D_800E7A30.x2;
                }
                D_800E7A30.y = ((SceneWinList *)D_800E7A30.unk98)->win->y + 6;
                D_800E7A30.y2 = ((SceneWinList *)D_800E7A30.unk98)->win->y2 - 6;
                if (D_800E7A30.y2 < D_800E7A30.y) {
                    D_800E7A30.y = D_800E7A30.y2;
                }
            }
        }
        if (i == ((u16 *)D_800C4C10)[0]) {
            D_800E7A30.flags2 &= ~4;
        }
        boot_state_slot_payload_alloc_copy(D_800E7A30.flags, D_800E91D0, D_800E7A30.size, &D_800E7A30.data);
        bcopy(&D_800E7A30, &g_state_slot_records[i], 0xA8);
        if (g_state_slot_records[i].flags2 & 2) {
            func_00008388(i);
        }
        func_0002CBCC();
        if (--g_boot_state_slot_queue_service_gate == 0) {
            break;
        }
    }
    func_0000859C();
    D_800C4C20 = -1;
    func_00007688();
}
void func_00007688(void);
void func_00007894(s32 id);
void boot_state_slot_payload_alloc_copy(u8 kind, void *src, u16 n, u8 **out);
void func_00008564(u8 *p, const void *dst);
