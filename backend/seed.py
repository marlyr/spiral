from database import SessionLocal
from models import Skill, SkatingTrack, SkillCategory

def seed_skills():
    db = SessionLocal()

    skills = [
        # BASIC
        Skill(name="Sit then stand up", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Forward marching", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Forward two foot glide", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Dip", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Forward swizzles (6-8)", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Backward wiggles (6-8)", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Beginning snowplow stop", track=SkatingTrack.basic, level=1, category=SkillCategory.foundation),
        Skill(name="Two foot hop in place", track=SkatingTrack.basic, level=1, bonus=True, category=SkillCategory.jump),

        Skill(name="Scooter pushes", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Forward one-foot glides", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Backward two-foot glide", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Rocking horse", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Backward swizzles (6-8)", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Two foot turns, forward to backward", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Moving snowplow stop", track=SkatingTrack.basic, level=2, category=SkillCategory.foundation),
        Skill(name="Curves", track=SkatingTrack.basic, level=2, bonus=True, category=SkillCategory.edge),

        Skill(name="Beginning forward stroking", track=SkatingTrack.basic, level=3, category=SkillCategory.foundation),
        Skill(name="Forward pumps on a circle (6-8)", track=SkatingTrack.basic, level=3, category=SkillCategory.foundation),
        Skill(name="Moving forward to backward two foot turns on a circle", track=SkatingTrack.basic, level=3, category=SkillCategory.foundation),
        Skill(name="Beginning backward one-foot glides", track=SkatingTrack.basic, level=3, category=SkillCategory.foundation),
        Skill(name="Backward snowplow stop", track=SkatingTrack.basic, level=3, category=SkillCategory.foundation),
        Skill(name="Forward slalom", track=SkatingTrack.basic, level=3, category=SkillCategory.footwork),
        Skill(name="Forward pivots", track=SkatingTrack.basic, level=3, bonus=True, category=SkillCategory.footwork),

        Skill(name="Forward outside edge on a circle", track=SkatingTrack.basic, level=4, category=SkillCategory.edge),
        Skill(name="Forward inside edge on a circle", track=SkatingTrack.basic, level=4, category=SkillCategory.edge),
        Skill(name="Forward crossovers", track=SkatingTrack.basic, level=4, category=SkillCategory.footwork),
        Skill(name="Backward pumps on a circle", track=SkatingTrack.basic, level=4, category=SkillCategory.foundation),
        Skill(name="Backward one-foot glides", track=SkatingTrack.basic, level=4, category=SkillCategory.foundation),
        Skill(name="Beginning two-foot spin", track=SkatingTrack.basic, level=4, category=SkillCategory.spin),
        Skill(name="Forward lunges", track=SkatingTrack.basic, level=4, bonus=True, category=SkillCategory.edge),

        Skill(name="Backward outside edge on a circle", track=SkatingTrack.basic, level=5, category=SkillCategory.edge),
        Skill(name="Backward inside edge on a circle", track=SkatingTrack.basic, level=5, category=SkillCategory.edge),
        Skill(name="Backward crossovers", track=SkatingTrack.basic, level=5, category=SkillCategory.footwork),
        Skill(name="Forward outside three-turn", track=SkatingTrack.basic, level=5, category=SkillCategory.footwork),
        Skill(name="Advanced two-foot spin (4-6 revs)", track=SkatingTrack.basic, level=5, category=SkillCategory.spin),
        Skill(name="Hockey stop", track=SkatingTrack.basic, level=5, category=SkillCategory.foundation),
        Skill(name="Side toe hop", track=SkatingTrack.basic, level=5, bonus=True, category=SkillCategory.jump),

        Skill(name="Forward inside three-turn", track=SkatingTrack.basic, level=6, category=SkillCategory.footwork),
        Skill(name="Moving backward to forward two-foot turn on a circle", track=SkatingTrack.basic, level=6, category=SkillCategory.foundation),
        Skill(name="Backward stroking", track=SkatingTrack.basic, level=6, bonus=True, category=SkillCategory.foundation),
        Skill(name="Beginning one-foot spin (2-4 revs)", track=SkatingTrack.basic, level=6, category=SkillCategory.spin),
        Skill(name="T-stops", track=SkatingTrack.basic, level=6, category=SkillCategory.foundation),
        Skill(name="Bunny hop", track=SkatingTrack.basic, level=6, category=SkillCategory.jump),
        Skill(name="Forward spiral on a straight line", track=SkatingTrack.basic, level=6, category=SkillCategory.edge),
        Skill(name="Shoot the duck", track=SkatingTrack.basic, level=6, bonus=True, category=SkillCategory.footwork),

        # ADULT
        Skill(name="Falling and recovery", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Forward marching", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Forward two foot glide", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Forward swizzles (4-6)", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Rocking horse", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Dip", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),
        Skill(name="Forward snowplow stop", track=SkatingTrack.adult, level=1, category=SkillCategory.foundation),

        Skill(name="Forward skating across the width of the ice", track=SkatingTrack.adult, level=2, category=SkillCategory.foundation),
        Skill(name="Forward one-foot glides", track=SkatingTrack.adult, level=2, category=SkillCategory.foundation),
        Skill(name="Forward slalom", track=SkatingTrack.adult, level=2, category=SkillCategory.footwork),
        Skill(name="Backward skating", track=SkatingTrack.adult, level=2, category=SkillCategory.foundation),
        Skill(name="Backward swizzles (4-6)", track=SkatingTrack.adult, level=2, category=SkillCategory.foundation),
        Skill(name="Two foot turns in place", track=SkatingTrack.adult, level=2, category=SkillCategory.foundation),

        Skill(name="Forward stroking", track=SkatingTrack.adult, level=3, category=SkillCategory.footwork),
        Skill(name="Forward pumps on a circle (6-8)", track=SkatingTrack.adult, level=3, category=SkillCategory.foundation),
        Skill(name="Moving forward to backward and backward to forward two foot-turns on a circle", track=SkatingTrack.adult, level=3, category=SkillCategory.foundation),
        Skill(name="Backward skating into long two-foot glide", track=SkatingTrack.adult, level=3, category=SkillCategory.foundation),
        Skill(name="Forward chasses on a circle", track=SkatingTrack.adult, level=3, category=SkillCategory.footwork),
        Skill(name="Backward snowplow stop", track=SkatingTrack.adult, level=3, bonus=True, category=SkillCategory.foundation),

        Skill(name="Forward outside edge on a circle", track=SkatingTrack.adult, level=4, category=SkillCategory.edge),
        Skill(name="Forward inside edge on a circle", track=SkatingTrack.adult, level=4, category=SkillCategory.edge),
        Skill(name="Forward crossovers", track=SkatingTrack.adult, level=4, category=SkillCategory.footwork),
        Skill(name="Backward one-foot glides", track=SkatingTrack.adult, level=4, category=SkillCategory.foundation),
        Skill(name="Backward pumps on a circle", track=SkatingTrack.adult, level=4, category=SkillCategory.foundation),
        Skill(name="Hockey stop", track=SkatingTrack.adult, level=4, category=SkillCategory.foundation),

        Skill(name="Backward outside edge on a circle", track=SkatingTrack.adult, level=5, category=SkillCategory.edge),
        Skill(name="Backward inside edge on a circle", track=SkatingTrack.adult, level=5, category=SkillCategory.edge),
        Skill(name="Backward crossovers", track=SkatingTrack.adult, level=5, category=SkillCategory.footwork),
        Skill(name="Forward outside three-turn", track=SkatingTrack.adult, level=5, category=SkillCategory.footwork),
        Skill(name="Forward swing rolls to count of six", track=SkatingTrack.adult, level=5, bonus=True, category=SkillCategory.footwork),
        Skill(name="Beginning two-foot spin", track=SkatingTrack.adult, level=5, category=SkillCategory.spin),

        Skill(name="Forward stroking with crossover end patterns", track=SkatingTrack.adult, level=6, category=SkillCategory.footwork),
        Skill(name="Backward stroking with crossover end patterns", track=SkatingTrack.adult, level=6, category=SkillCategory.footwork),
        Skill(name="Forward inside three turn", track=SkatingTrack.adult, level=6, category=SkillCategory.footwork),
        Skill(name="Forward outside to inside change of edge", track=SkatingTrack.adult, level=6, category=SkillCategory.edge),
        Skill(name="T-stop", track=SkatingTrack.adult, level=6, category=SkillCategory.foundation),
        Skill(name="Lunge", track=SkatingTrack.adult, level=6, category=SkillCategory.edge),
        Skill(name="Two-foot into one-foot spin", track=SkatingTrack.adult, level=6, category=SkillCategory.spin),

        # PREFREESKATE
        Skill(name="Forward inside open mohawk from standstill", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.footwork),
        Skill(name="Backward crossovers to landing position", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.footwork),
        Skill(name="Backward outside edge to a forward outside edge transition", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.edge),
        Skill(name="Crossover and mohawk sequence", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.footwork),
        Skill(name="One-foot upright spin, optional entry", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.spin),
        Skill(name="Mazurka", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.jump),
        Skill(name="Waltz jump", track=SkatingTrack.pre_freeskate, level=1, category=SkillCategory.jump),
        Skill(name="Backward inside pivots", track=SkatingTrack.pre_freeskate, level=1, bonus=True, category=SkillCategory.footwork),

        # FREESKATE
        Skill(name="Forward power stroking", track=SkatingTrack.freeskate, level=1, category=SkillCategory.footwork),
        Skill(name="Basic forward outside and forward inside consecutive edges", track=SkatingTrack.freeskate, level=1, category=SkillCategory.edge),
        Skill(name="Backward outside three-turns", track=SkatingTrack.freeskate, level=1, category=SkillCategory.footwork),
        Skill(name="Upright spin, entry from back crossovers (4-6+ revs)", track=SkatingTrack.freeskate, level=1, category=SkillCategory.spin),
        Skill(name="Half flip", track=SkatingTrack.freeskate, level=1, category=SkillCategory.jump),
        Skill(name="Toe loop", track=SkatingTrack.freeskate, level=1, category=SkillCategory.jump),
        Skill(name="Waltz jump-side toe hop-waltz jump sequence, or waltz jump-ballet jump-toe loop sequence", track=SkatingTrack.freeskate, level=1, category=SkillCategory.jump),

        Skill(name="Alternating forward outside and inside spirals", track=SkatingTrack.freeskate, level=2, category=SkillCategory.edge),
        Skill(name="Basic backward outside and backward inside consecutive edges (4-6)", track=SkatingTrack.freeskate, level=2, category=SkillCategory.edge),
        Skill(name="Backward inside three-turns", track=SkatingTrack.freeskate, level=2, category=SkillCategory.footwork),
        Skill(name="Beginning back spin (1-2 revs)", track=SkatingTrack.freeskate, level=2, category=SkillCategory.spin),
        Skill(name="Half lutz", track=SkatingTrack.freeskate, level=2, category=SkillCategory.jump),
        Skill(name="Salchow", track=SkatingTrack.freeskate, level=2, category=SkillCategory.jump),
        Skill(name="Forward spiral variation", track=SkatingTrack.freeskate, level=2, bonus=True, category=SkillCategory.edge),

        Skill(name="Alternating backward crossovers to back outside edges (4)", track=SkatingTrack.freeskate, level=3, category=SkillCategory.footwork),
        Skill(name="Alternating mohawk/crossover sequence", track=SkatingTrack.freeskate, level=3, category=SkillCategory.footwork),
        Skill(name="Waltz three-turns", track=SkatingTrack.freeskate, level=3, category=SkillCategory.footwork),
        Skill(name="Advanced back spin (3+ revs)", track=SkatingTrack.freeskate, level=3, category=SkillCategory.spin),
        Skill(name="Loop jump", track=SkatingTrack.freeskate, level=3, category=SkillCategory.jump),
        Skill(name="Waltz jump-toe loop or Salchow-toe loop combination", track=SkatingTrack.freeskate, level=3, category=SkillCategory.jump),
        Skill(name="Toe step sequence", track=SkatingTrack.freeskate, level=3, bonus=True, category=SkillCategory.footwork),

        Skill(name="Forward power three-turns", track=SkatingTrack.freeskate, level=4, category=SkillCategory.footwork),
        Skill(name="Waltz eight", track=SkatingTrack.freeskate, level=4, category=SkillCategory.edge),
        Skill(name="Forward upright spin to backward upright spin (3 revs, each foot)", track=SkatingTrack.freeskate, level=4, category=SkillCategory.spin),
        Skill(name="Sit spin (3+ revs)", track=SkatingTrack.freeskate, level=4, category=SkillCategory.spin),
        Skill(name="Half loop", track=SkatingTrack.freeskate, level=4, category=SkillCategory.jump),
        Skill(name="Flip", track=SkatingTrack.freeskate, level=4, category=SkillCategory.jump),
        Skill(name="Split jump, stag jump or split falling leaf", track=SkatingTrack.freeskate, level=4, bonus=True, category=SkillCategory.jump),

        Skill(name="Backward power three-turns", track=SkatingTrack.freeskate, level=5, category=SkillCategory.footwork),
        Skill(name="Five-step mohawk sequence", track=SkatingTrack.freeskate, level=5, category=SkillCategory.footwork),
        Skill(name="Camel spin (3+ revs)", track=SkatingTrack.freeskate, level=5, category=SkillCategory.spin),
        Skill(name="Waltz jump-loop jump combination", track=SkatingTrack.freeskate, level=5, category=SkillCategory.jump),
        Skill(name="Lutz jump", track=SkatingTrack.freeskate, level=5, category=SkillCategory.jump),
        Skill(name="Loop-loop combination", track=SkatingTrack.freeskate, level=5, bonus=True, category=SkillCategory.jump),

        Skill(name="Forward power pulls", track=SkatingTrack.freeskate, level=6, category=SkillCategory.edge),
        Skill(name="Creative step sequence", track=SkatingTrack.freeskate, level=6, category=SkillCategory.footwork),
        Skill(name="Camel-sit spin combination (2+ revs per position)", track=SkatingTrack.freeskate, level=6, category=SkillCategory.spin),
        Skill(name="Layback, attitude spin, or cross-foot spin (3 revs)", track=SkatingTrack.freeskate, level=6, category=SkillCategory.spin),
        Skill(name="Waltz jump-Half loop-Salchow jump sequence", track=SkatingTrack.freeskate, level=6, category=SkillCategory.jump),
        Skill(name="Beginning axel", track=SkatingTrack.freeskate, level=6, category=SkillCategory.jump),
        Skill(name="Backward outside pivot", track=SkatingTrack.freeskate, level=6, bonus=True, category=SkillCategory.footwork),
    ]

    db.add_all(skills)
    db.commit()
    db.close()
    print("Seeded successfully")

if __name__ == "__main__":
    seed_skills()
