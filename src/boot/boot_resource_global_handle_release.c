extern void *D_800AF0B0;
extern void *func_00049aa0(void *resource);

void boot_resource_global_handle_release(void)
{
    func_00049aa0(D_800AF0B0);
    D_800AF0B0 = 0;
}
