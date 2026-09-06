typedef unsigned int u32;
extern u32 *func_00206174(u32);

void *func_00204EE0(u32 handle, u32 index)
{
    u32 *directory = func_00206174(handle);
    void *result;
    if (directory == 0) {
        result = 0;
    } else {
        result = (void *)(directory[index] + (u32)directory);
    }
    return result;
}
