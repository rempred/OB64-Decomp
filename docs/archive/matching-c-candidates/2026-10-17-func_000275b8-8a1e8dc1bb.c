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

int func_000275b8(PfsState *state, PakHeader *oldHeader, PakHeader *newHeader)
{
    unsigned char test[32];
    unsigned char readback[32];
    unsigned short addresses[4];
    int bank;
    int i;
    int result;
    int bankPositive;

    newHeader->field00 = ~0U;
    newHeader->field04 = func_0002aae0();
    newHeader->field08 = oldHeader->field08;
    newHeader->field10 = oldHeader->field10;
    bank = 0;
    if (state->field65 != 0) {
        result = func_000274d0(state, 0);
        if (result != 0)
            return result;
    }
    do {
        result = func_000274d0(state, bank);
        if (result != 0)
            return result;
        result = func_00027fd0(state->queue, state->channel, 0, test);
        if (result != 0)
            return result;
        test[0] = bank | 0x80;
        for (i = 1; i < 32; i++)
            test[i] = ~test[i];
        result = func_000281c0(state->queue, state->channel, 0, test, 0);
        if (result != 0)
            return result;
        result = func_00027fd0(state->queue, state->channel, 0, readback);
        if (result != 0)
            return result;
        for (i = 0; i < 32; i++) {
            if (readback[i] != test[i])
                break;
        }
        if (i != 32)
            break;
        if (bank > 0) {
            result = func_000274d0(state, 0);
            if (result != 0)
                return result;
            result = func_00027fd0(state->queue, state->channel, 0, test);
            if (result != 0)
                return result;
            if (test[0] != 0x80)
                break;
        }
    } while (++bank < 62);
    if (state->field65 != 0) {
        result = func_000274d0(state, 0);
        if (result != 0)
            return result;
    }
    bankPositive = bank > 0;
    newHeader->field18 = bankPositive | (oldHeader->field18 & 0xfffe);
    newHeader->field1a = bank;
    newHeader->field1b = oldHeader->field1b;
    func_00027574(newHeader, &newHeader->field1c, &newHeader->field1e);
    addresses[0] = 1;
    addresses[1] = 3;
    addresses[2] = 4;
    addresses[3] = 6;
    for (i = 0; i < 4; i++) {
        result = func_000281c0(state->queue, state->channel, addresses[i],
                              (unsigned char *)newHeader, 1);
        if (result != 0)
            return result;
    }
    result = func_00027fd0(state->queue, state->channel, 1, test);
    if (result != 0)
        return result;
    for (i = 0; i < 32; i++) {
        if (test[i] != ((unsigned char *)newHeader)[i])
            return 11;
    }
    return 0;
}
