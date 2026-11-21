extern unsigned char *D_801D06AC;
extern void *resource_free(void *resource);

void func_00201D24(void)
{
    resource_free(D_801D06AC);
    D_801D06AC = 0;
}
