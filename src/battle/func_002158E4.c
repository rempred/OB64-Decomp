typedef unsigned char u8;

extern u8 *D_801CE8BC;
extern u8 *D_801CE8C0;

void *func_80070F30(int size);
void func_800712C4(void *pointer);
void func_00023460(void *destination, void *source, int size);
void func_801EFAAC(void);
void func_0021C3B0(void);

void func_002158E4(void)
{
    u8 *allocation;
    u8 *snapshot;
    u8 *owner;
    u8 saved_value;

    allocation = func_80070F30(0x6094);
    owner = D_801CE8BC;
    __asm__ volatile ("" : "=r" (snapshot) : "0" (allocation), "r" (owner));
    *(int *)(D_801CE8C0 + 0x814) = 0;
    func_00023460(owner, snapshot, 0x6094);
    saved_value = D_801CE8C0[0x82E];
    func_801EFAAC();
    D_801CE8C0[0x82E] = saved_value;
    func_00023460(snapshot + 0x1C4, (u8 *)D_801CE8BC + 0x1C4, 0x1360);
    func_00023460(snapshot + 0x1524, (u8 *)D_801CE8BC + 0x1524, 0x3C00);
    func_00023460(snapshot + 0x5124, (u8 *)D_801CE8BC + 0x5124, 0x19C);
    func_00023460(snapshot + 0x52C0, (u8 *)D_801CE8BC + 0x52C0, 0x400);
    *(int *)((u8 *)D_801CE8BC + 0x56C0) = *(int *)(snapshot + 0x56C0);
    func_800712C4(snapshot);
    func_0021C3B0();
}
