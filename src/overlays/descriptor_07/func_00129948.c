typedef unsigned char u8;
typedef struct {
    u8 unk0;
    u8 flags;
    u8 rest[0x17];
} SquadRec;
extern SquadRec g_func_001957D0_source_records[];
void func_00129948(const void *unit) {
    const u8 *bytes = unit;
    SquadRec *s = &g_func_001957D0_source_records[bytes[4]];
    s->flags |= 4;
}
