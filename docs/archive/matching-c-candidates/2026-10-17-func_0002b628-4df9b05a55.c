typedef struct {
    unsigned int field00;
    void *queue;
    int channel;
    unsigned char field0c[0x44];
    int field50;
    unsigned char field54[8];
    unsigned int field5c;
    int field60;
    unsigned char field64;
    unsigned char field65;
} PfsState;

typedef union {
    unsigned short value;
    struct { unsigned char byte00, byte01; } bytes;
} Node;

typedef struct {
    unsigned int field00;
    unsigned short field04;
    Node field06;
    unsigned char field08[2];
    unsigned short field0a;
    unsigned char field0c[4];
    unsigned char field10[16];
} DirectoryEntry;

typedef struct {
    Node table[128];
    unsigned char field100;
    unsigned char field101[256];
} CheckerState;

extern int func_00027bd4(PfsState *state);
extern int func_00027a08(PfsState *state);
extern int func_000274d0(PfsState *state, unsigned char bank);
extern int func_00027c8c(PfsState *state, Node *table,
                        unsigned char mode, unsigned char bank);
extern int func_00027fd0(void *queue, int channel, unsigned short address,
                        unsigned char *data);
extern int func_000281c0(void *queue, int channel, unsigned short address,
                        unsigned char *data, int mode);
extern void func_00023780(void *data, unsigned int bytes);
int func_0002b070(PfsState *state);
int func_0002b4d0(PfsState *state, CheckerState *scratch);
int func_0002b628(PfsState *state, Node node, CheckerState *scratch);

int func_0002b628(PfsState *state, Node node, CheckerState *scratch)
{
    unsigned char bank;
    int count = 0;
    int bankIndex;
    int i;
    int start;
    int result;
    int mapIndex = (node.bytes.byte01 >> 2) +
                   ((node.bytes.byte00 & 7) * 32);

    for (bank = 0; bank < state->field64; bank++) {
        bankIndex = bank;
        start = bankIndex == 0 ? state->field60 : 1;
        if (bankIndex == node.bytes.byte00 ||
            ((scratch->field101[mapIndex] >> (bankIndex & 7)) & 1)) {
            if (bankIndex != scratch->field100) {
                result = func_00027c8c(state, scratch->table, 0, bankIndex);
                if ((result != 0) & (result != 3))
                    return result;
                scratch->field100 = bank;
            }
            for (i = start; (count < 2) & (i < 128); i++)
                count += scratch->table[i].value == node.value;
            if (count >= 2)
                return 2;
        }
    }
    return count;
}
