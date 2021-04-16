from flask_restful import Api, Resource, reqparse
import re

class MolecularParser(Resource):

  def post(self):
    parser = reqparse.RequestParser()
    parser.add_argument('formula', type=str)
    args = parser.parse_args()
    formula = args['formula']
    if not self.check_formula(formula):
      return False
    atoms = self.parse_formula(formula)
    return {'atoms': atoms}

  def check_formula(self, formula):
    count = 0
    for i in formula:
      if i in '([{':
        count += 1
      elif i in ')]}':
        count -= 1
      if count < 0:
        return False
    return (count == 0)

  def parse_formula(self, formula):
    split_formula = re.findall('[A-Z][a-z]?|\d+|.', formula)
    elements = "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split()
    count = 1
    multipliers = [1]
    atoms = {}

    for part in split_formula[::-1]:
      if part.isalpha():
        if part not in elements:
          return part
        if part in atoms:
          atoms[part] += multipliers[-1]*count
        else:
          atoms[part] = multipliers[-1]*count
        count = 1
      elif part.isdecimal():
        count = int(part)
      elif part in '([{':
        multipliers.pop()
        count = 1
      elif part in ')]}':
        multipliers.append(multipliers[-1]*count)
        count = 1
      else:
        return False

    return atoms