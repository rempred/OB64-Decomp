extern unsigned int *D_8022A958;

extern void *resource_free(void *resource);
extern void func_00283FA8(int selector, int continuation);

void func_002841CC(int selector)
{
    resource_free(D_8022A958);
    D_8022A958 = 0;
    func_00283FA8(selector, 0);
}
