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

    i = 0;
    sum = 0;
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

int func_00027bd4(PfsState *state)
{
    unsigned char header[32];
    int result;

    if (state->field65 != 0) {
        result = func_000274d0(state, 0);
        if (result == 2)
            result = func_000274d0(state, 0);
        if (result != 0)
            return result;
    }
    result = func_00027fd0(state->queue, state->channel, 1, header);
    if (result != 0) {
        if (result != 2)
            return result;
        result = func_00027fd0(state->queue, state->channel, 1, header);
        if (result != 0)
            return result;
    }
    return func_00023350(state->field0c, header, 32) != 0 ? 2 : 0;
}
