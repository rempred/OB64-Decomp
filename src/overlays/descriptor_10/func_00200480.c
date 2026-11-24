#include "game/boot_archive_record.h"
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
void *D_8009DD38(u32 handle);
void *resource_alloc_tree_scan(u32 size);
void *func_000016C4(void *ptr);
extern void *D_801D0748[];
extern void *D_801D074C;
extern void *D_801D0750;
extern void *D_801D0754;
extern u8 D_801976DA;

extern ResourceArchiveTemplate D_801D02B0;
extern u8 D_801CEC80[];
extern s16 D_801D0758;
extern s16 D_801D075A;
extern s16 D_801D075C;
extern s16 D_801D075E;
extern s16 D_801D0760;

void D_801C5CE0(void);
void func_00200480(void) {
    ResourceArchiveInput arc;
    ResourceArchiveRequest req;
    u8 *dir;
    s32 id;
    func_000016C4(D_801D0748[0]);
    D_801D0748[0] = ((void *)0);
    func_000016C4(D_801D074C);
    D_801D074C = ((void *)0);
    func_000016C4(D_801D0750);
    D_801D0750 = ((void *)0);
    func_000016C4(D_801D0754);
    D_801D0754 = ((void *)0);
    D_801D0748[0] = D_8009DD38(0x31D484);
    D_801D074C = D_8009DD38(0x31EE10);
    D_801D0750 = D_8009DD38(0x32007E);
    arc = D_801D02B0.input;
    req = D_801D02B0.request;
    dir = resource_alloc_tree_scan(D_8009DAF4(0x0218E9B4));
    D_8009DBB8(dir, 0x0218E9B4);
    id = (*(s32 *)((u8 *)(dir) + (8)));
    func_000016C4(dir);
    arc.size = D_8009DAF4(id);
    arc.buffer = resource_alloc_tree_scan(arc.size);
    D_8009DBB8(arc.buffer, id);
    req.record_index = D_801CEC80[D_801976DA == 0x18 ? 12 : (u8)(D_801976DA % 24)];
    boot_resource_archive_load_many(&arc, &req, 1);
    func_000016C4(arc.buffer);
    D_801D0758 = 0xAA;
    D_801D075A = 0x10;
    D_801D075C = 0x16;
    D_801D075E = 0x98;
    D_801D0760 = 1;
    D_801D0754 = req.buffer;
    D_801C5CE0();
}
