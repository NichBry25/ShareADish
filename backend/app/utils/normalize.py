import re
def normalize(s):
    s = s.lower().strip()
    s = re.sub(r'[\-\_,]',"",s)
    return s