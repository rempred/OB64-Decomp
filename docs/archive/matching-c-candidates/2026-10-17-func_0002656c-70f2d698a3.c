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
extern int func_000274d0(PfsState *state, unsigned char bank);
extern int func_00027fd0(void *queue, int channel, unsigned short address,
                        unsigned char *data);
extern int func_000281c0(void *queue, int channel, unsigned short address,
                        unsigned char *data, int mode);
extern int func_00027c8c(PfsState *state, Node *table, int mode,
                        unsigned char bank);
extern void func_80093380(void *destination, unsigned int bytes);
int func_0002656c(PfsState *state, Node *table, int page,
                  int bank, Node *next);

int func_0002656c(PfsState *state, Node *table, int page,
                  int bank, Node *next)
{
    unsigned short current;
    unsigned short previous;

    current = (bank << 8) | (page & 0xff);
    do {
        Node *link = table;
        previous = current;
        current = table[current & 0xff].value;
        link += previous & 0xff;
        link->value = 3;
    } while (current >= state->field60 && (current >> 8) == (unsigned char)bank);
    next->value = current;
    return 0;
}
