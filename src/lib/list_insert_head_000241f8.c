typedef unsigned int u32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef struct ListNode ListNode;
struct ListNode {
    ListNode * volatile next;
    void *value;
};

typedef struct ListOwner ListOwner;
struct ListOwner {
    unsigned char reserved[0x260];
    ListNode *head;
};

extern u32 func_0008B820(u32 value);
extern u32 func_0008B820_noarg(void) asm("func_0008B820");

void func_000241f8(ListOwner *owner, ListNode *node, void *value)
{
    ListNode *head;
    register u32 status asm("$2");

    status = func_0008B820(1);

    node->value = value;
    head = owner->head;
    asm(".set noreorder");
    asm("addu $4,%0,$0" : : "r"(status));
    node->next = head;
    asm(".set reorder");
    owner->head = node;
    func_0008B820_noarg();
}
