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
    struct {
        unsigned char byte00;
        unsigned char byte01;
    } bytes;
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

extern int func_00026bc0(PfsState *state, unsigned short field04,
                        unsigned int field00, const unsigned char *field10,
                        const unsigned char *field0c, int *file);
extern int func_00026d80(PfsState *state, int *bytes);
extern int func_00027c8c(PfsState *state, Node *table, int mode,
                        unsigned char bank);
extern void func_00023460(const void *source, void *destination,
                         unsigned int bytes);
extern int func_000281c0(void *queue, int channel, unsigned short address,
                        unsigned char *data, int mode);
int func_0002629c(PfsState *state, Node *table, int pages, int *first,
                  unsigned char bank, int *count, int *last);

int func_0002629c(PfsState *state, Node *table, int pages, int *first,
                  unsigned char bank, int *count, int *last)
{
    int start;
    int i;
    int current;
    int firstPage;
    int result;

    start = 1;
    result = 0;
    if (bank == 0)
        start = state->field60;
    for (i = start; i < 128; i++) {
        if (table[i].value == 3)
            break;
    }
    if (i == 128) {
        *first = -1;
        return result;
    } else {
        *count = 1;
        current = firstPage = i;
        for (i = current + 1; *count < pages && i < 128; i++) {
            if (table[i].value == 3) {
                Node *link = table;
                link += current;
                link->bytes.byte00 = bank;
                link->bytes.byte01 = i;
                current = i;
                (*count)++;
            }
        }
        *first = firstPage;
        if (i == 128 && *count < pages) {
            *last = current;
        } else {
            Node *link = table;
            link += current;
            link->value = 1;
            *last = 0;
        }
    }
    return result;
}
