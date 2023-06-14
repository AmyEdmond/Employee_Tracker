INSERT INTO department (name)
VALUES ("HR"),
       ("Engineering"),
       ("Service"),
       ("Sales"),
       ("IT"),
       ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES 
    ('HR Director', 110000, 1),
    ("Software Engineer", 130000, 2),
    ("Customer service specialist", 40000, 3),
    ('Sales Associate', 60000, 4),
    ('Jr Developer', 85000, 5),
    ('Accountant', 115000, 6);



INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jean", "Paul", 1, NULL),
       ("John", "Q", 2, NULL),
       ("Valerie", "Richard", 3, 1),
       ("Kelly", "Knowles", 4, 1),
       ("Darcy", "Lennon", 5, 2),
        ("Maya", "Badou", 6, 1);
       
