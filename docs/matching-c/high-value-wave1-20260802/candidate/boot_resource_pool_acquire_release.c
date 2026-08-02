typedef struct ResourcePoolEntry {
    void **slot;
    unsigned int size;
} ResourcePoolEntry;

extern void *func_00001330(unsigned int size);
extern void func_000016C4(void *ptr);
extern void *resource_pool;

void func_0000B33C(unsigned int acquire)
{
    if (acquire != 0) {
        unsigned int offset;
        ResourcePoolEntry *entry;

        asm(".set noreorder");
        if (resource_pool == 0) {
            return;
        }
        asm("addu %0,$0,$0" : "=r"(offset));
        entry = (ResourcePoolEntry *)&resource_pool;
        do {
            *entry->slot = func_00001330(
                *(unsigned int *)((unsigned char *)&resource_pool + 4 + offset));
            offset += 8;
            entry++;
        } while (entry->slot != 0);
    } else {
        ResourcePoolEntry *entry;

        if (resource_pool == 0) {
            return;
        }
        entry = (ResourcePoolEntry *)&resource_pool;
        do {
            func_000016C4(*entry->slot);
            entry++;
        } while (entry->slot != 0);
    }
}
