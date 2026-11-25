typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void * resource_alloc_tree_scan(u32);
void *func_000016C4(void *ptr);
u32 D_8009DAF4(u32 handle);
void *D_8009DBB8(void *dst, u32 handle);
u32 func_0000ABE0(u8 *p);
void * resource_alloc_tree_scan(u32);
void func_0000A510(void *dst, void *src);
s32 func_002B57E0(s32 i, s32 j, void **out) {
    u32 *t;
    u32 h;
    s32 n;
    t = resource_alloc_tree_scan(D_8009DAF4(0x1A8D7A6));
    D_8009DBB8(t, 0x1A8D7A6);
    h = t[i];
    func_000016C4(t);
    t = resource_alloc_tree_scan(D_8009DAF4(h));
    D_8009DBB8(t, h);
    h = t[j];
    func_000016C4(t);
    t = resource_alloc_tree_scan(D_8009DAF4(h));
    D_8009DBB8(t, h);
    n = func_0000ABE0(t);
    func_0000A510(*out = resource_alloc_tree_scan(n), t);
    func_000016C4(t);
    return n;
}
