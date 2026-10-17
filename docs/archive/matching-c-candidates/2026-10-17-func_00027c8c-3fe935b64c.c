typedef struct {
    unsigned int field00;
    void *queue;
    int channel;
    unsigned char field0c[32];
    unsigned char field2c[32];
    int field4c;
    int field50;
    int field54;
    int field58;
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
    unsigned int field04;
    unsigned long long field08;
    unsigned long long field10;
    unsigned short field18;
    unsigned char field1a;
    unsigned char field1b;
    unsigned short field1c;
    unsigned short field1e;
} PakHeader;

extern unsigned int func_0002aae0(void);
extern int func_000274d0(PfsState *state, unsigned char bank);
extern int func_00027fd0(void *queue, int channel, unsigned short address,
                        unsigned char *data);
extern int func_000281c0(void *queue, int channel, unsigned short address,
                        unsigned char *data, int mode);
extern void func_80093060(const void *source, void *destination, unsigned int bytes);
extern int func_00023350(const void *first, const void *second, unsigned int bytes);
extern int D_800ABAA0;
extern unsigned char D_800ABAA4;
extern Node D_800E8110[128];

inline unsigned short func_00027540(const unsigned char *data, int bytes);
inline int func_00027574(PakHeader *header, unsigned short *sum,
                        unsigned short *inverse);
int func_000275b8(PfsState *state, PakHeader *oldHeader, PakHeader *newHeader);
int func_000278a4(PfsState *state, PakHeader *header);
int func_00027a08(PfsState *state);
int func_00027bd4(PfsState *state);
int func_00027c8c(PfsState *state, Node *table, unsigned char mode,
                  unsigned char bank);

extern inline unsigned short func_00027540(const unsigned char *data, int bytes)
{
    /* This declaration order and word accumulator preserve the retail
     * register homes and entry initialization with the pinned compiler. */
    int i;
    unsigned int sum;

    sum = 0;
    i = 0;
    for (; i < bytes; i++)
        sum += *data++;
    return sum;
}

extern inline int func_00027574(PakHeader *header, unsigned short *sum,
                        unsigned short *inverse)
{
    unsigned short *cursor = (unsigned short *)header;
    unsigned short *end = &header->field1c;
    unsigned short value;

    *sum = *inverse = 0;
    do {
        value = *cursor++;
        *sum += value;
        *inverse += ~value;
    } while (cursor < end);
    return 0;
}

int func_00027c8c(PfsState *state, Node *table, unsigned char mode,
                  unsigned char bank)
{
    int start;
    int i;
    int result;
    /* Share the cursor across the indexed loop and both walking loops. */
    unsigned char *block;

    if (mode == 0 && bank == D_800ABAA4 && state->channel == D_800ABAA0) {
        func_80093060(D_800E8110, table, 256);
        return 0;
    }
    if (state->field65 != 0) {
        result = func_000274d0(state, 0);
        if (result != 0)
            return result;
    }
    start = 1;
    if (bank == 0)
        start = state->field60;
    if (mode == 1)
        table[0].bytes.byte01 = func_00027540((unsigned char *)&table[start],
                                             (128 - start) * 2);
    for (i = 0; i < 8; i++) {
        block = (unsigned char *)table + i * 32;
        if (mode == 1) {
            func_000281c0(state->queue, state->channel,
                          state->field54 + bank * 8 + i, block, 0);
            result = func_000281c0(state->queue, state->channel,
                                   state->field58 + bank * 8 + i, block, 0);
        } else {
            result = func_00027fd0(state->queue, state->channel,
                                   state->field54 + bank * 8 + i, block);
        }
        if (result != 0)
            return result;
    }
    if (mode == 0) {
        int sumIndex;
        unsigned int checksum;
        const unsigned char *data;
        int bytes;

        /* Explicit read-checksum temporaries preserve their distinct
         * register lifetimes with the pinned compiler. */
        checksum = 0;
        /* Offset-first integer arithmetic preserves the operand order
         * on this 32-bit target. */
        data = (const unsigned char *)(start * 2 + (unsigned int)table);
        bytes = (128 - start) * 2;
        sumIndex = 0;
        for (; sumIndex < bytes; sumIndex++)
            checksum += *data++;
        if ((unsigned char)checksum != table[0].bytes.byte01) {
            {
                int bankOffset;
                i = 0;
                bankOffset = bank * 8;
                block = (unsigned char *)table;
                for (; i < 8; i++) {
                    func_00027fd0(state->queue, state->channel,
                                  state->field58 + bankOffset + i, block);
                    block += 32;
                }
            }
            {
                int bytes;
                int sumIndex;
                unsigned int checksum;
                const unsigned char *data;

                /* Keep this checksum walk local so its temporaries have
                 * the retail lifetimes with the pinned compiler. */
                bytes = (128 - start) * 2;
                data = (const unsigned char *)(start * 2 + (unsigned int)table);
                checksum = 0;
                sumIndex = 0;
                for (; sumIndex < bytes; sumIndex++)
                    checksum += *data++;
                if ((unsigned char)checksum != table[0].bytes.byte01)
                    return 3;
            }
            {
                int bankOffset;
                i = 0;
                bankOffset = bank * 8;
                block = (unsigned char *)table;
                for (; i < 8; i++) {
                    func_000281c0(state->queue, state->channel,
                                  state->field54 + bankOffset + i, block, 0);
                    block += 32;
                }
            }
        }
    }
    D_800ABAA4 = bank;
    func_80093060(table, D_800E8110, 256);
    D_800ABAA0 = state->channel;
    return 0;
}
